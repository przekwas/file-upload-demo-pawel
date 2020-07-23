import * as React from 'react';

const App: React.FC<AppProps> = (props) => {
	const [username, setUsername] = React.useState<string>('');
	const [selectedFile, setSelectedFile] = React.useState<File>(null);
	const [randomKey, setRandomKey] = React.useState<string>(Math.random().toString(36));
	const [users, setUsers] = React.useState<any>([]);

	const getShit = React.useCallback(() => {
		(async () => {
			const res = await fetch('/api/users');
			const users = await res.json();
			setUsers(users);
		})();
	}, []);

	React.useEffect(() => {
		getShit();
	}, [getShit]);

	React.useEffect(() => {

		setInterval(() => {
			getShit();
		}, 15000);

		return () => clearInterval();

	}, []);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedFile(e.target.files[0]);
	};

	const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const newUser = new FormData();
		newUser.append('username', username);
		newUser.append('avatar', selectedFile);
		const res = await fetch('/auth/users/register', {
			method: 'POST',
			body: newUser
		});
		if (res.ok) {
			setUsername('');
			setSelectedFile(null);
			setRandomKey(Math.random().toString(36));
		}
	};

	return (
		<main className="container">
			<section className="row justify-content-center mt-5">
				<div className="col-md-6">
					<h1 className="display-4 text-center">Register Profile</h1>
					<form className="form-group border rounded-lg p-3">
						<div className="row">
							<div className="col">
								<label htmlFor="username">Username</label>
								<input
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									placeholder="Fox McCloud"
									type="text"
									className="form-control"
									id="username"
								/>
							</div>
						</div>
						<div className="row justify-content-between align-items-center mt-2">
							<div className="col-8">
								<label htmlFor="avatar">Avatar</label>
								<input
									key={randomKey}
									onChange={handleFileChange}
									className="form-control-file"
									type="file"
									id="avatar"
								/>
							</div>
							<div className="col-4 d-flex justify-content-end">
								<img
									src={
										selectedFile
											? URL.createObjectURL(selectedFile)
											: 'https://via.placeholder.com/64'
									}
									className="img-thumbnail"
									style={{ height: '64px', width: '64px', objectFit: 'contain' }}
									alt="avatar"
								/>
							</div>
						</div>
						<div className="row mt-2">
							<div className="col">
								<button
									onClick={handleRegister}
									className="btn btn-outline-primary btn-block mt-3">
									Register Yo Shit
								</button>
							</div>
						</div>
					</form>
				</div>
			</section>
			<section className="row mt-3">
				{users.map((user: any) => (
					<div key={user.id} className="col-md-6">
						<div className="card my-2 shadow">
							<img src={user.avatar_url} alt="fuck" className="card-img-top" style={{ height: '150px', objectFit: 'contain' }} />
							<div className="card-body text-center">
								<h4 className="card-title">{user.username}</h4>
							</div>
						</div>
					</div>
				))}
			</section>
		</main>
	);
};

export interface AppProps {}

export default App;
