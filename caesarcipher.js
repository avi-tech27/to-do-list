const s = "I should have known that you would have a perfect answer for me!!!"
const shift = 1

function split(s) {
    var sz = Math.ceil(s.length / 5);
    return [s.slice(0, sz), s.slice(sz, sz * 2), s.slice(sz * 2, sz * 3), s.slice(sz * 3, sz * 4), s.slice(sz * 4)];
}


function movingShift(s, shift) {
    let result = ""
    for(let i= 0; i< s.length; i++){
        if(s.charCodeAt(i) >=65 && s.charCodeAt(i) <= 90 || s.charCodeAt(i) >=97 && s.charCodeAt(i) <= 122  ){
            let finalCharCodeValue = s.charCodeAt(i) + shift + i
            if(s.charCodeAt(i) >=65 && s.charCodeAt(i) <= 90 && finalCharCodeValue >90){
                let cycles = Math.floor((finalCharCodeValue - 65) / 26);
                result += String.fromCharCode(value - cycles * 26);
            }else if(s.charCodeAt(i) >=97 && s.charCodeAt(i) <= 122 && finalCharCodeValue >122){
                let cycles = Math.floor((finalCharCodeValue - 97) / 26);
                result += String.fromCharCode(finalCharCodeValue - cycles * 26);
            }else{
                result += String.fromCharCode(finalCharCodeValue);
            }
        }else{
            result+=s[i]
        }
    }
    return split(result)
}

console.log(movingShift(s,1))