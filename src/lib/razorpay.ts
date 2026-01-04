import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZOR_PAY_SECRET_KEY as string,
})

export const validateIFSC = async (ifscCode: string) => {
    try {
        const response = await fetch(`https://ifsc.razorpay.com/${ifscCode}`);

        if (response.ok) {
            const data = await response.json();
            return {
                isValid: true,
                bank: data.BANK,
                branch: data.BRANCH,
                city: data.CITY,
                state: data.STATE,
                address: data.ADDRESS
            };
        } else {
            return { isValid: false };
        }
    } catch (error) {
        console.error('IFSC validation error:', error);
        return { isValid: false };
    }
};