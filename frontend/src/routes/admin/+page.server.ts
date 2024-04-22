interface User {
	username: string;
	email: string;
	role: string;
}

export const load = async (serverLoadEvent) => {
	const { fetch } = serverLoadEvent;
	const response = await fetch('http://localhost:8080/auth/admin');
	const data = await response.json();
	const userName: string = data.user.userName;
	const userId: number = data.user.userId;
	const userRole: string = data.user.role;
	const usersNameEmailAndRole: User[] = data.usersNameEmailAndRole;
	console.log(usersNameEmailAndRole);
	return {
		props: {
			userId,
			userName,
			userRole,
			usersNameEmailAndRole
		}
	};
};
export const ssr = true;
