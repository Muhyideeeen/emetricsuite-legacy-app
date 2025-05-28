import styled,{ css } from "styled-components";

// this is a mixin that makes the 'th or td ' postion td
const StickyItem=css`
position: -webkit-sticky;
position: sticky;
background-color: white;
${(prop)=>prop.right?`
right:100px;text-align:center;`:"left:0px;"}
//box-shadow: 200px -21px 296px 10px rgba(0,0,0,0.11);`
// const StickyItemLeft = css`
//     border: 1px solid blue;
//     width: 150px;
//     min-width: 150px;
//     max-width: 150px;
//     left:${(props)=>}
// `
export const TableView =styled.div`
    /* width:100%; */
    margin:auto;
`

export const StickyTableWrapper = styled.div`
    position: relative;
    overflow: auto;
    /* border: 1px solid black; */
    /* white-space: nowrap; */

`


export const StickyTH = styled.th`
${StickyItem}
/* width: 50px; */
/* border: 1px solid red; */
width: 150px;
     min-width: 150px;
     max-width: 150px;
     `
export const StickyTD = styled.td`
${StickyItem}
     width: 150px;
     min-width: 150px;
     max-width: 150px;
`
export const NormalTD=styled.td`
    padding:.1rem 1rem;
    text-align: center;
    white-space: nowrap;
`