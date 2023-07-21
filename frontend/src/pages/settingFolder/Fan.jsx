import user from '../../../public/assets/images/user-pic.png'
function Fan() {
    return (
        <div className='Follow-row'>
            <div className='left'>
                <div className='img-holder'>
                    <img src={user} alt="" />
                </div>
                <div className='txt'>
                    <p>Monica Lucas</p>
                    <p>161 Followers</p>
                </div>
            </div>
            <div className='right'>
                <button className='unfollow'>Remove</button>
            </div>
        </div>
    )
}
export default Fan