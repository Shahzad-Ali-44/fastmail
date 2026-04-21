import Joi, { type AnySchema, type SchemaLike } from 'joi';

export const IDSchema = Joi.number().integer().positive();

export const EmailSchema = Joi.string().email().max(255).lowercase().trim();


export const validateObject = (body: any, schemaMap: Joi.SchemaMap): any => 
    {
    return validate(body, Joi.object().keys(schemaMap));
};



export const validate = (body: any, schema: AnySchema): any => 
    {
        if (typeof body === 'string') 
        {
            body = JSON.parse(body);
        }
    const { value, error } = schema.options({ stripUnknown: true }).validate(body);
    if (error) 
    {
        throw error;
    }
    return value;
};