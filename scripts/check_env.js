(async ()=>{
  try{
    const res = await fetch('http://127.0.0.1:3001/api/test/env-check');
    console.log('status', res.status);
    console.log(await res.text());
  }catch(e){
    console.error('ERR', e.message);
    process.exit(2);
  }
})();
