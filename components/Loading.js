import BarLoader from'react-spinners/BarLoader'

function Loading() {
	return (
		<center style={{display: 'grid', placeItems: 'center', height: '100vh'}}>
			<div>
				<img
					src="https://download.logo.wine/logo/WhatsApp/WhatsApp-Logo.wine.png"
					alt=""
                    height={200}
                    style={{marginBottom: 10}}
				/>
                <BarLoader 
                color='#3CBC28'
                />
			</div>
		</center>
	)
}


export default Loading