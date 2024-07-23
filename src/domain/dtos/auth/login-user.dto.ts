import { regularExps } from "../../../config";

export class LoginUserDto {

    private constructor(        
        public readonly email: string,
        public readonly password: string
    ) {}

    public static create(object: { [key: string]: any }): [ string?, LoginUserDto? ] {

        const { email, password } = object;
        
        if (!email) return ['Property email is required'];
        if (!regularExps.email.test(email)) return ['email is not valid'];
        if (!password) return ['Property password is required'];
        if (password.length < 8) return ['Password must be at least 8 characters'];

        return [undefined, new LoginUserDto(email, password)];        
    }
}

