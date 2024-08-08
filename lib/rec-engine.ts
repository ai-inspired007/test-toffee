// import { Subscription, PrismaClient, Companion } from "@prisma/client";
// import prismadb from "./prismadb";
// import { SimpleLinearRegression } from 'ml-regression-simple-linear';
// import { max } from "date-fns";

// export default async function recEngine() {    
//     const userId = "user_2ai6o2a5jk5ol9CCk3c1Gn7JjWv";
//     let userprefs: Record<string, number> = {};
//     let unvisited: string[] = [];

//     type Peer = {
//         similarity: number;
//         prefs: Record<string, number>;
//     }
//     let peers: Record<string, Peer> = {}

//     const companions = await prismadb.companion.findMany({
//         include: {
//             messages: true,
//         },
//         });
    
//         companions.forEach(companion => {
//         let ind = 0;
//         companion.messages.forEach(message => {
//                 let total = 0;
//                 if (message.userId === userId){
//                     total+=1;
//                 }else if (Object.keys(peers).length < 50){
//                     peers[message.userId] = {similarity:0, prefs:{}};
//                 }
//                 userprefs[companion.id] = total;
//                 if (total === 0){
//                     unvisited.push(companion.id);
//                 }
//                 ind += 1;
//         })
        
//         //  Prefs for peers
//         ind = 0;
//         companions.forEach(companion => {
//             for (const key in peers){
//                 peers[key].prefs[companion.id] = 0;
//             }
//                 companion.messages.forEach(message =>{
//                 if(message.userId in peers){

//                     peers[message.userId].prefs[companion.id] += 1;

//                 }
//             })
//             ind+=1;
//         })
//     });
//     function cosinesim(A: number[], B: number[] ) {
//         var dotproduct = 0;
//         var mA = 0;
//         var mB = 0;
    
//         for(var i = 0; i < A.length; i++) {
//             dotproduct += A[i] * B[i];
//             mA += A[i] * A[i];
//             mB += B[i] * B[i];
    
//         }
    
//         mA = Math.sqrt(mA);
//         mB = Math.sqrt(mB);
//         var similarity = (mA === 0 || mB === 0) ? 1 : dotproduct / (mA * mB);
    
//         return similarity;
//     }

//     // Assigning similarities
//     for(const peer in peers){
//         const similarity = cosinesim(Object.values(userprefs), Object.values(peers[peer].prefs));
//         peers[peer].similarity = similarity;
//     }

//     unvisited.forEach(companion => {
//         let score: number = 0;
//         let normalizer: number = 0;
//         for(const peer in peers){
//             score += peers[peer].prefs[companion] * peers[peer].similarity;
//             normalizer += peers[peer].similarity;
//         }
//         const finalScore = (normalizer === 0)? 0: score/normalizer;
//         userprefs[companion] = finalScore;
//     })

//     const final = Object.entries(userprefs)
//     final.sort((a, b) => b[1] - a[1]);
//     return Object.fromEntries(final);

//     // const n = 33;
//     // console.log(peers[Object.keys(peers)[n]])
//     // for(const i in peers[Object.keys(peers)[n]].prefs){
//     //     if(peers[Object.keys(peers)[n]].prefs[i] !== 0){
//     //         console.log(peers[Object.keys(peers)[n]].prefs[i])
//     //     }
//     // }
    




// }