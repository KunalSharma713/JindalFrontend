import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TextLoader = () => {
    return (
        <div >
            <Skeleton
                count={1}
                style={{ width: '80px', height: '30px' }}
                baseColor="#ededed"          // background color
                highlightColor="#dddddd"      // shimmer color
            />
        </div>
    );
};
export default TextLoader;