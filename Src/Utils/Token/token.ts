import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'

interface Token {
    [key:string]:any
}
interface GenerateToken {
    payload:Token,
    secretKey?:string,
    options?: SignOptions;
}
export const generateToken =({payload , secretKey = process.env.SECRET_TOKEN as string,options}:GenerateToken):string=>{
return jwt.sign(payload,secretKey,options)
}
//verify Token
interface VerifyToken {
    token:string,
    secretKey?:string
}
export const verifyToken = ({ token, secretKey = process.env.SECRET_TOKEN as string }: VerifyToken): JwtPayload | null => {
    try {
        if (!token) {
            console.error("❌ Token is missing");
            return null;
        }

        const decoded = jwt.verify(token, secretKey) as JwtPayload;
        console.log("✅ Decoded Token:", decoded);

        if (!decoded || (!("_id" in decoded) && !("id" in decoded))) {
            console.error("❌ Token missing 'id' or '_id' field");
            return null;
        }

        // Ensure consistency: Always use "_id"
        decoded._id = decoded._id || decoded.id;
        delete decoded.id;

        return decoded;  
    } catch (error) {
        console.error("❌ Token Verification Error:", error);
        return null;  
    }
};