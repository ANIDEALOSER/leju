function foo(b){
    return new Promise((resolve,reject)=>{
        b++;
        setTimeout(()=>{
            console.log('2000后执行...');
            resolve(b)
        },2000)
    })
}


function bar(a){
    return new Promise((resolve,reject)=>{
        a++;
        setTimeout(()=>{
            console.log('3000后执行...');
            resolve(a)
        },3000)
    })
}

async function main(){
    // f2在f1后执行
    var rs1 = await bar(1);
    var rs2 = await foo(rs1);
    console.log('f1==>',rs1);
    console.log('f2==>',rs2);
}

main();