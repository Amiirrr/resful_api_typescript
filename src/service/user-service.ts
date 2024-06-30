import { User } from "@prisma/client";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { CreateUserRequest, LoginUserRequest, UserResponse, toUserResponse, UpdateUserRequest } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"

//user service untuk logic 
export class UserService {
    static async register(request: CreateUserRequest): Promise<UserResponse> {

        //Validasi Data using ZOD
        const registerRequest = Validation.validate(UserValidation.REGISTER, request);

        // Checking unused username
        const totalUserWithSameUsername = await prismaClient.user.count({
            where: {
                username: registerRequest.username
            }
        });

        if (totalUserWithSameUsername != 0) {
            throw new ResponseError(400, "Username already exists")
        }

        // hashing password
        registerRequest.password = await bcrypt.hash(registerRequest.password, 10)

        // Create user
        const user = await prismaClient.user.create({
            data: registerRequest
        })

        //send response user
        return toUserResponse(user);
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        //Validasi Login
        const loginRequest = Validation.validate(UserValidation.LOGIN, request);

        //cek akun berdasarkan username
        let user = await prismaClient.user.findUnique({
            where: {
                username: loginRequest.username
            }
        })
        // error kalau tidak ada user
        if (!user) {
            throw new ResponseError(401, "username or password is wrong")
        }

        // compare password
        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password)

        //error kalau password tidak sama
        if (!isPasswordValid) {
            throw new ResponseError(401, "username or password is wrong")
        }

        //bikin token
        user = await prismaClient.user.update({
            where: {
                username: loginRequest.username
            },
            data: {
                token: uuid()
            }
        })

        const response = toUserResponse(user);
        response.token = user.token!

        return response;
    }

    static async get(user: User): Promise<UserResponse> {
        return toUserResponse(user);
    }

    static async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
        const updateRequest = Validation.validate(UserValidation.UPDATE, request);

        if (updateRequest.name) {
            user.name = updateRequest.name;
        }

        if (updateRequest.password) {
            user.password = await bcrypt.hash(updateRequest.password, 10);
        }

        const result = await prismaClient.user.update({
            where: {
                username: user.username
            },
            data: user
        });

        return toUserResponse(result);
    }

    static async logout(user: User): Promise<UserResponse> {
        const result = await prismaClient.user.update({
            where: {
                username: user.username
            },
            data: {
                token: null
            }
        })

        return toUserResponse(result);
    }
}