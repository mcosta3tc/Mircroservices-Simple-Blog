import React, {useState} from 'react';
import axios from 'axios';

const PostCreate = () => {
    const [title, setTitle] = useState('');
    const onsubmit = async (event) => {
        event.preventDefault();
        // ? => k8s ==> Ingress Controller (posts.com)
        await axios.post('http://posts.com/posts/create', {
            title
        });
        setTitle('');
    };
    return (
            <div>
                <form onSubmit={onsubmit}>
                    <div className="form-group mb-3">
                        <label className="form-label">Title</label>
                        <input className="form-control" value={title} onChange={event => setTitle(event.target.value)}/>
                    </div>
                    <button className="btn btn-primary">Submit</button>
                </form>
            </div>
    );
};

export default PostCreate;