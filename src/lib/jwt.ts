// import { jwtDecode } from "jwt-decode";

// // Define the structure of your JWT payload
// export interface JWTPayload {
//   sub: string;
//   email: string;
//   membership?: Record<string, string>;
//   iat?: number;
//   exp?: number;
// }

// /**
//  * Decodes a JWT token and returns its payload
//  * @param token The JWT token to decode
//  * @returns The decoded payload
//  */
// export function decodeToken(token: string): JWTPayload {
//   try {
//     return jwtDecode<JWTPayload>(token);
//   } catch (error) {
//     console.error("Error decoding token:", error);
//     throw new Error("Invalid token");
//   }
// }

// /**
//  * Checks if a token is expired
//  * @param token The JWT token to check
//  * @returns boolean indicating if the token is expired
//  */
// export function isTokenExpired(token: string): boolean {
//   try {
//     const decoded = decodeToken(token);
//     if (!decoded.exp) return true;

//     // Convert exp to milliseconds and compare with current time
//     return decoded.exp * 1000 < Date.now();
//   } catch (error) {
//     return true;
//   }
// }

// /**
//  * Extracts token from Authorization header
//  * @param authHeader The Authorization header string
//  * @returns The token or null if not found
//  */
// export function extractTokenFromHeader(
//   authHeader: string | null
// ): string | null {
//   if (!authHeader) return null;

//   const [type, token] = authHeader.split(" ");
//   if (type !== "Bearer" || !token) return null;

//   return token;
// }
