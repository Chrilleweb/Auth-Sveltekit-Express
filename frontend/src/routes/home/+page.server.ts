export const load = async (serverLoadEvent) => {
	const { fetch } = serverLoadEvent;
	const response = await fetch('http://localhost:8080/auth/home');
	const data = await response.json();
	const userName = data.userName;
	const userId = data.userId;
	return {
		props: {
			userId,
			userName
		}
	};
};
export const ssr = true;
