import API from '../src/api';

const Test = () => {
  const fetchData = async () => {
    try {
      const res = await API.get('/test');
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return <button onClick={fetchData}>Test API</button>;
};

export default Test;
