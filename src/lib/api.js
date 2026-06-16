export async function Fetchdata(path){
    await new Promise(resolve => setTimeout(resolve, 500));
    const response = await fetch(path);
    if(!response.ok) throw new Error("Failed to fetch");
    return await response.json();
}