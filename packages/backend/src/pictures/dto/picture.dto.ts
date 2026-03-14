export class PictureDto {
  id: string;
  url: string;
  title: string;
  active: boolean;
}

export class PictureConfigDto {
  pictures: PictureDto[];
  rotationEnabled: boolean;
  rotationInterval: number;
}
