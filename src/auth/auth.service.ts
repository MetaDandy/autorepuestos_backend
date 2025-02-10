import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/role/entities/role.entity';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jswtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ){}

  async signIn(authDto: AuthDto){
    const {email, password} = authDto;

    const {data, error} = await this.supabaseService.getClient().auth.signInWithPassword({
      email,
      password
    });

    if(error) throw new UnauthorizedException(error.message);

    const supabaseUserId = data.user?.id;

    if(!supabaseUserId) throw new UnauthorizedException('User Id not found');

    const user = await this.userRepository.findOne({
      where:{
        supabase_user_id: supabaseUserId,
      }
    });

    if(!user) throw new UnauthorizedException('User not found');

    const payload = {sub: user.id};
    const token = this.jswtService.sign(payload);
    const refreshToken = this.jswtService.sign(payload,{
      expiresIn: '7d',
    });

    user.refresh_token = refreshToken;
    await this.userRepository.save(user);
    
    return {
      token,
      refresh_token: refreshToken,
    }
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
