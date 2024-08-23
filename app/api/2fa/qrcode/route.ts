import QRCode from 'qrcode';  
import speakeasy from "@levminer/speakeasy";
import { NextResponse } from 'next/server';  

export async function GET() {  
  try {  
    // Generate a new secret for MFA  
    const secret = speakeasy.generateSecret({  
      name: "Toffee authenticator",  
      length: 20,  
      issuer: "Toffee",  
    });   

    // Log the secret to ensure it's generated correctly  
    console.log('Generated Secret:', secret);  

    // Ensure the OTPAuth URL is present  
    const otpauthURL = secret.otpauth_url;  
    if (!otpauthURL) {  
      throw new Error('Failed to create OTPAuth URL');  
    }  

    // Generate a QR code from the OTPAuth URL  
    const qrCodeDataURL = await QRCode.toDataURL(otpauthURL);  

    return NextResponse.json({  
      qrCode: qrCodeDataURL,  
      secret: secret.base32,  
    });  
  } catch (error) {  
    console.error('[2FA]', error);  
    return new NextResponse('Internal Error', { status: 500 });  
  }  
}