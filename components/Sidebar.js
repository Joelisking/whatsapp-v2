import { Chat, Logout, Search } from '@mui/icons-material'
import { Avatar, Button, IconButton } from '@mui/material'
import styled from 'styled-components'
import * as EmailValidator from 'email-validator'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { auth, db } from '../firebase'
import Chats from './Chats'

function Sidebar() {
	const [user] = useAuthState(auth)
	const userChatRef = db
		.collection('chats')
		.where('users', 'array-contains', user.email)
	const [chatsSnapshot] = useCollection(userChatRef)

	const createChat = () => {
		const input = prompt(
			'Please enter an email address for the user you wish to chat with'
		)

		if (!input) return null

		if (
			EmailValidator.validate(input) &&
			!chatAlreadyExists(input) &&
			input !== user.email
		) {
			// We need to add the chat into the DB 'chats' collection if it doesn't already exist and is valid
			db.collection('chats').add({
				users: [user.email, input],
			})
		}
	}

	const out = () => {
		auth.signOut()
	}

	const chatAlreadyExists = (recipientEmail) =>
		!!chatsSnapshot?.docs.find(
			(chat) =>
				chat.data().users.find((user) => user === recipientEmail)?.length > 0
		)

	return (
		<Container>
			<Header>
				<UserAvatar src={user.photoURL} />
				<IconsContainer>
					<IconButton>
						<Chat onClick={createChat} />
					</IconButton>

					<IconButton>
						<Logout onClick={out} />
					</IconButton>
				</IconsContainer>
			</Header>

			<SearchButton>
				<Search />
				<SearchInput placeholder="Search in chats" />
			</SearchButton>

			<SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

			{/* List of Chats */}
			{chatsSnapshot?.docs.map((chat) => (
				<Chats key={chat.id} id={chat.id} users={chat.data().users}/>
			))}
		</Container>
	)
}
export default Sidebar

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    overflow-y: scroll;
    min-width: 300px;
    max-width: 350px;
`

const SearchButton = styled.div`
	display: flex;
	align-items: center;
	padding: 20px;
	border-radius: 2px;
`

const SidebarButton = styled(Button)`
	width: 100%;
	color: black;

	border-top: 1px solid whitesmoke;
	border-bottom: 1px solid whitesmoke;
`

const SearchInput = styled.input`
	outline-width: 0;
	border: none;
	flex: 1;
`

const Header = styled.div`
	display: flex;
	position: sticky;
	top: 0;
	background-color: white;
	z-index: 1;
	justify-content: space-between;
	align-items: center;
	padding: 15px;
	height: 80px;
	border-bottom: 1px solid whitesmoke;
`

const UserAvatar = styled(Avatar)`
	cursor: pointer;
	:hover {
		opacity: 0.8;
	}
`

const IconsContainer = styled.div``
