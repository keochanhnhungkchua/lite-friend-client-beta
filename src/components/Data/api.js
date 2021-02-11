import axios  from "axios" ;
const token = localStorage.getItem("lite-friend");
export const uploadImage = async (imgData)=>{
  delete axios.defaults.headers.common["Authorization"];
    var imgUrl = [];
    for (let i = 0; i < imgData.length; i++) {
      var file =imgData[i];
      var formdata = new FormData();
      const config = {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      };
      formdata.append("file", file);
      formdata.append("cloud_name", "keochanhnhungkchua");
      formdata.append("upload_preset", "demo123");
      try{
        let {data} = await axios.post(
            "https://api.cloudinary.com/v1_1/keochanhnhungkchua/auto/upload",
            formdata,
            config
          );
          imgUrl.push(data.secure_url);
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        // let res = await fetch(
        //   "https://api.cloudinary.com/v1_1/emia/auto/upload",
        //   {
        //     method: "post",
        //     mode: "cors",
        //     body: formdata
        //   }
        // );
        // console.log(res)
        // let json = await res.json();
        // console.log(JSON.stringify(json.secure_url));
      }catch (error) {
          console.log(error)
      }
      
    }
    return imgUrl
}