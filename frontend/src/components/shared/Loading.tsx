import { LOGO_IMAGE } from '../../constants/images';

const Loading = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-spinner">
                <img src={LOGO_IMAGE} alt="logo" className="loading-logo" />
                <p className="loading-text">Loading...</p>
            </div>
        </div>
    );
};

export default Loading;
