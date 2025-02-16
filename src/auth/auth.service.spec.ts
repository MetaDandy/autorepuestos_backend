import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';

const mockUserRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  softRemove: jest.fn(),
  findAndCount: jest.fn(),
};

const mockRoleRepository = {
  findOneBy: jest.fn(),
};

const mockSupabaseService = {
  getClient: jest.fn().mockReturnValue({
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
    },
  }),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock_token'),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Role), useValue: mockRoleRepository },
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('debe estar definido', () => {
    expect(authService).toBeDefined();
  });

  describe('findAll()', () => {
    it('debe retornar una lista paginada de usuarios', async () => {
      const users = [{ id: '1', name: 'John Doe' }];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await authService.findAll({ page: 1, limit: 10 });
      expect(result.data).toEqual(users);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('debe retornar un usuario si existe', async () => {
      const user = { id: '1', name: 'John Doe' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await authService.findOne('1');
      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' }, relations: ['role'] });
    });

    it('debe lanzar un error si el usuario no existe', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(authService.findOne('1')).rejects.toThrow();
    });
  });

  describe('update()', () => {
    it('debe actualizar un usuario existente', async () => {
      const user = { id: '1', name: 'John Doe' };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue({ ...user, name: 'Updated Name' });

      const result = await authService.update('1', { name: 'Updated Name' });
      expect(result.name).toBe('Updated Name');
    });
  });

  describe('softDelete()', () => {
    it('debe marcar un usuario como eliminado', async () => {
      const user = { id: '1', name: 'John Doe' };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.softRemove.mockResolvedValue(user);

      const result = await authService.softDelete('1');
      expect(result).toEqual(user);
    });
  });
});
