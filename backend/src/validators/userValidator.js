const Joi = require('joi');

const validateUser = (data) => {
    const schema = Joi.object({
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .min(6)
            .max(30)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$'))
            .required()
            .messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 6 characters',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        }),

        confirmPassword: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.only': "Password don't match",
                'string.empty': 'Confirm password is required',
        }),
    });
    return schema.validate(data);
};

const authenticateUser = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};


module.exports = {
    validateUser,
    authenticateUser
};
