import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

// 🛡️ Firebase Hata Kodlarını Türkçeye Çeviren Tercüman
const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'Geçersiz bir e-posta adresi girdin.';
        case 'auth/user-not-found':
            return 'Böyle bir maceracı bulunamadı.';
        case 'auth/wrong-password':
            return 'Parola yanlış, tekrar dene!';
        case 'auth/invalid-credential':
            return 'E-posta veya parola hatalı. Bilgilerini kontrol et.';
        case 'auth/email-already-in-use':
            return 'Bu yoldaş zaten handa kayıtlı!';
        case 'auth/weak-password':
            return 'Parolan çok zayıf. Lütfen en az 6 karakterli daha güçlü bir parola döv.';
        case 'auth/too-many-requests':
            return 'Hanın kapılarını çok fazla zorladın! Lütfen biraz bekleyip tekrar dene.';
        case 'auth/network-request-failed':
            return 'Han ile bağlantı kurulamadı. İnternet bağlantını kontrol et.';
        default:
            return 'Beklenmedik bir büyü ters tepti. Lütfen daha sonra tekrar dene.';
    }
};

function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(userCredential.user);
                setMessage("Kayıt başarılı! Lütfen e-posta adresinize gelen doğrulama bağlantısına tıklayın.");
                setIsLogin(true);
            }
        } catch (err) {
            // Çirkin kodları tercümana verip, güzel Türkçe metni alıyoruz
            setError(getFriendlyErrorMessage(err.code));
        }
    };

    return (
        <div className="masa-arkaplan">
            <div className="intro-ekrani">
                <h1 className="intro-baslik">Han Kapısı</h1>
                <p className="intro-metin">Macerana devam etmek için kimliğini doğrula.</p>

                {error && <div className="hata-mesaji">{error}</div>}
                {message && <div style={{ color: '#16a34a', fontSize: '20px', marginBottom: '15px' }}>{message}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="email" placeholder="E-Posta Adresi" className="intro-input"
                        value={email} onChange={(e) => setEmail(e.target.value)} required
                    />
                    <input
                        type="password" placeholder="Parola" className="intro-input"
                        value={password} onChange={(e) => setPassword(e.target.value)} required
                    />
                    <button type="submit" className="intro-buton">
                        {isLogin ? 'Handan İçeri Gir' : 'Maceraya Katıl'}
                    </button>
                </form>

                <button className="auth-gecis-butonu" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Yeni bir maceracı mısın? Kayıt ol.' : 'Zaten bir yoldaş mısın? Giriş yap.'}
                </button>
            </div>
        </div>
    );
}

export default Auth;