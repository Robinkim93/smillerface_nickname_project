import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Nicknames } from './app.entities';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  private readonly URL: string = this.configService.get('NAVER_URL');
  private readonly API_KEY = {
    'X-Naver-Client-Id': this.configService.get('SECRET_ID'),
    'X-Naver-Client-Secret': this.configService.get('SECRET_KEY'),
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Nicknames)
    private readonly nicknameRepository: Repository<Nicknames>,
  ) {}

  async getFaceData(image) {
    const formData = new FormData();

    const buffer: string = image.buffer;
    const filename: string = image.originalname;

    formData.append('image', buffer, filename);

    const config = {
      headers: {
        ...this.API_KEY,
        'content-type': 'multipart/form-data',
      },
    };

    const data = await lastValueFrom(
      this.httpService
        .post(this.URL, formData, config)
        .pipe(map((res) => res.data)),
    ).catch((err) => console.log(err));

    const nickNameData = await this.nicknameRepository
      .createQueryBuilder('nicknames')
      .select()
      .getOne();

    const nickName = nickNameData.nickname;

    data.faces[0].celebrity.value = `${nickName} ${data.faces[0].celebrity.value}`;

    return data;
  }
}
