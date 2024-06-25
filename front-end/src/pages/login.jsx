import { useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
 
        try {
            const username = "string12";
            const password = "stringify";
            const res = await axios.get('http://localhost:5000/auth/login', {
                params: {
                    username: username,
                    password: password
                }
            });
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    };
    

    return (
        <main className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
            <div className="mt-8 w-full max-w-xl bg-white shadow-md rounded p-6">
                <div className="text-lg font-bold mb-4">ログイン（会員専用ページ）</div>
                <div className="bg-gray-800 text-white p-4 rounded ">会員専用ページにログインする</div>
                <form className="space-y-4 p-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-gray-700">ユーザー名またはメールアドレス</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">パスワード</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            id="rememeberMeCheckbox"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="mr-2 hover:cursor-pointer"
                        />
                        <label htmlFor="rememberMeCheckbox" onClick={() => setRememberMe(!rememberMe)} className="text-gray-700 hover:cursor-pointer">次からは自動的にログインする</label>
                    </div>
                    <div className="text-center mt-4">
                        <button type="submit" className="w-[75%] bg-red-500 text-white p-4 rounded mt-4">ログイン</button>
                    </div>
                </form>
            </div>
            <div className="w-full max-w-xl bg-white shadow-md rounded mt-8 p-6">
                <div className="text-lg font-bold mb-4">新会員登録</div>
                <div className="bg-gray-800 text-white p-4 rounded">シネマイレージ®カードをお持ちでない方</div>
                <div className="p-4">
                    <p>TOHOシネマズの会員カード「シネマイレージ®」にご登録いただくことで、以下のサービスを受けることができます。</p>
                    <ul className="list-disc list-inside mt-2 text-gray-700 red-markers">
                        <li>６回観たら１回無料</li>
                        <li>マイルを貯めてドリンクやポップコーンと交換</li>
                        <li>毎週火曜日はカード提示で1,300円</li>
                        <li>その他うれしい特典が満載！</li>
                    </ul>
                    <div className="text-center mt-4">
                        <Link to='/register'>
                            <button className="bg-red-500 w-[75%] text-white p-4 rounded mt-4">新規会員申し込み</button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
