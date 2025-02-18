import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService = {
    create: jest.fn().mockResolvedValue({ id: '1', name: 'Test User' }),
    signIn: jest.fn().mockResolvedValue({ access_token: 'mock_token' }),
    findAll: jest.fn().mockResolvedValue({ data: [], total: 0 }),
    findAllSoftDeleted: jest.fn().mockResolvedValue({ data: [], total: 0 }),
    findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Test User' }),
    update: jest.fn().mockResolvedValue({ id: '1', name: 'Updated User' }),
    softDelete: jest.fn().mockResolvedValue({ id: '1', deleted: true }),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/auth (POST) debe crear un usuario', async () => {
    const createUserDto: CreateUserDto = { name: 'Test User', email: 'test@example.com', password: '123456', role_id: 'a68ea23b-1383-461c-90e9-c8342d275d55', phone: '65933751' };
    return request(app.getHttpServer())
      .post('/auth')
      .send(createUserDto)
      .expect(201)
      .expect(authService.create());
  });

  it('/auth/sign-in (POST) debe iniciar sesión', async () => {
    const authDto: AuthDto = { email: 'test@example.com', password: '123456' };
    return request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(authDto)
      .expect(201)
      .expect(authService.signIn());
  });

  it('/auth (GET) debe obtener todos los usuarios', async () => {
    return request(app.getHttpServer())
      .get('/auth')
      .expect(200)
      .expect(authService.findAll());
  });

  it('/auth/soft (GET) debe obtener todos los usuarios eliminados', async () => {
    return request(app.getHttpServer())
      .get('/auth/soft')
      .expect(200)
      .expect(authService.findAllSoftDeleted());
  });

  it('/auth/:id (GET) debe obtener un usuario por ID', async () => {
    return request(app.getHttpServer())
      .get('/auth/1')
      .expect(200)
      .expect(authService.findOne());
  });

  it('/auth/:id (PATCH) debe actualizar un usuario', async () => {
    const updateUserDto: UpdateUserDto = { name: 'Updated User' };
    return request(app.getHttpServer())
      .patch('/auth/1')
      .send(updateUserDto)
      .expect(200)
      .expect(authService.update());
  });

  it('/auth/hard_delete/:id (DELETE) debe eliminar un usuario permanentemente', async () => {
    return request(app.getHttpServer())
      .delete('/auth/hard_delete/1')
      .expect(200)
      .expect(authService.softDelete());
  });

  it('/auth/soft_delete/:id (DELETE) debe eliminar un usuario suavemente', async () => {
    return request(app.getHttpServer())
      .delete('/auth/soft_delete/1')
      .expect(200)
      .expect(authService.softDelete());
  });

  afterAll(async () => {
    await app.close();
  });
});
