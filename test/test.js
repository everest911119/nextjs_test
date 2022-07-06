const fun = () => {
  console.log('被调用');
  return new Promise((resolve, reject) => {
    resolve('hello');
  });
};

const usefunData = async () => {
  const data = await fun()
  return data
};
usefunData().then(res=>{
  const data = res
  console.log(data)
})