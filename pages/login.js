import Head from 'next/head'
import styled from 'styled-components'
import { Button } from '@mui/material'
import { auth, provider } from '../firebase'

function Login() {
	const signIn = () => {
		auth.signInWithPopup(provider).catch(alert)
	}
	return (
		<Container>
			<Head>
				<title>Login</title>
			</Head>

			<LoginContainer>
				<Logo
					src="https://download.logo.wine/logo/WhatsApp/WhatsApp-Logo.wine.png"
					width={400}
				/>
				{/* <Logo src="./logo.png"/> */}
				<Button onClick={signIn} variant="outlined" color="inherit">
					Sign in with Google
				</Button>
			</LoginContainer>
		</Container>
	)
}
export default Login

const Container = styled.div`
	display: grid;
	place-items: center;
	height: 100vh;
	background-color: whitesmoke;
`

const LoginContainer = styled.div`
	padding: 100px 50px;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: white;
	border-radius: 5px;
`

const Logo = styled.img`
	margin-bottom: 50px;
`
