import { UserDetailUpdateDto } from '../dtos/userdetail.update.dto'
import { UserDetailCreateDto } from '../dtos/userdetail.create.dto';
import { UserDetailResponseDto } from '../dtos/userdetail.response.dto';

export interface IUserDetailService {
  updateProfile(userId: string, data: UserDetailUpdateDto): Promise<UserDetailResponseDto>;
  createProfile(data: UserDetailCreateDto): Promise<UserDetailResponseDto>;
  getProfileById(userId: string): Promise<UserDetailResponseDto>;
}
