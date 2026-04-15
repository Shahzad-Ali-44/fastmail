import Joi, { type AnySchema, type SchemaLike, type ValidationOptions } from 'joi';

export const IDSchema = Joi.number().integer().positive();

export const EmailSchema = Joi.string().email().max(255).lowercase().trim();



export const validateArray = ( body: any, item: SchemaLike, options: ValidationOptions = {},): any[] => 
    {
    return validate(body, Joi.array().items(item).min(1));
};





export const validateObject = (body: any,  schemaMap: Joi.SchemaMap,): any => 
    {
    return validate(body, Joi.object().keys(schemaMap));
};




export const validate = (body: any, schema: AnySchema): any => 
    {

        if (typeof body === 'string') 
        {
            body = JSON.parse(body);
        }
    
    const { value, error } = schema.validate(body);

    if (error) 
    {
        throw error;
    }

    return value;
};
