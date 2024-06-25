import { useState } from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Add your login logic here
    };

    return (
        <main className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
            <div className="mt-8 w-full max-w-xl bg-white shadow-md rounded p-6">
                <div className="text-lg font-bold mb-4">新会員登録（会員専用ページ）</div>
                <div className="bg-gray-800 text-white p-4 rounded ">会員専用ページにログインする</div>
                <form className="space-y-4 p-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-gray-700">ユーザー名</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">メールアドレス</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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

                    <div className="text-center mt-4">
                        <button type="submit" className="w-[75%] bg-red-500 text-white p-4 rounded mt-4">登録する</button>
                    </div>
                </form>
            </div>
        </main>
    );
}
