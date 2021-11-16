import React, {useState} from 'react';
import axios from 'axios';

const PostCreate = () => {
    const [title, setTitle] = useState('');
    const onsubmit = async (event) => {
        event.preventDefault();
        await axios.post('http://localhost:4000/posts', {
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