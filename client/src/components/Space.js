import { useState } from 'react'

function Space(props) {
    const [invitee, setInvitee] = useState([])
    
    return (
        <section className="">
            
            <div className="">
                <input type="text" name="invitee" onplaceholder="Enter Invitee:" />
            </div>
            
        </section>
    )
}

export default Space