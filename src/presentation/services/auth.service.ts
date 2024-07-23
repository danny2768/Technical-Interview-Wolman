import { BcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";


export class AuthService {

    constructor() {}

    private async generateToken( payload: { [key: string]: any }, durationTime?: string ){
        const token = await JwtAdapter.generateToken( payload, durationTime );
        if ( !token ) throw CustomError.internalServer('Error generating token');

        return token;
    }

    public async registerUser( registerUserDto: RegisterUserDto) {
        // Validating if the email already exists
        const existsUser = await UserModel.findOne({ email: registerUserDto.email });
        if (existsUser) throw CustomError.badRequest('Email already exists');

        try {
            // Creating user, hashing password & saving user
            const user = new UserModel(registerUserDto);                                    
            user.password = BcryptAdapter.hash( registerUserDto.password )            
            await user.save();                        

            const { password, ...userEntity } = UserEntity.fromObj( user );                        

            return {
                user: {...userEntity},
                message: 'User registered successfully.'
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }        
    };

    public async logingUser( loginUserDto: LoginUserDto ) {
        // Validating if the email exists
        const user = await UserModel.findOne({ email: loginUserDto.email });
        if (!user) throw CustomError.badRequest('Incorrect email');

        // Validating if the password is correct
        const isMatch: boolean = BcryptAdapter.compare( loginUserDto.password, user.password );
        if (!isMatch) throw CustomError.badRequest('Incorrect password');

        const { password, ...userEntity } = UserEntity.fromObj( user );
        const token = await this.generateToken( { id: user.id } );

        return {
            user: userEntity,
            token
        };
    };
}