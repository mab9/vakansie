import {dom} from "../assets/util/dom.js";
import {appendFirst} from "../assets/util/appends.js";
import {onValueChange, setValueOf} from "../base/presentationModel/presentationModel.js";

export {modalProjector, pageCss}

const masterClassName = 'nav-main-view'; // should be unique for this projector

/**
 * @param rootElement
 * @param authCtrl {AuthController}
 * @param showModalAttr {Attribute}
 * @param showModalBtn {HTMLElement}
 */
const modalProjector = (rootElement, authCtrl, showModalAttr, showModalBtn) => {

    const modalElement = dom(`
           <div class="${masterClassName}-modal">
                 <div class="${masterClassName}-modal-header">
                   <h2>Firstname Lastname</h2>
                   <p>email</p>
                   <p>Manage your Vakansie Account</p>
                 </div>
                 <div class="${masterClassName}-modal-body">
                   <p>Sign out</p>
                 </div>
                 <div class="${masterClassName}-modal-footer">
                   <p>Terms of Service</p>
                 </div>
           </div>`);


    const [modal] = modalElement.children;

    onValueChange(showModalAttr)(isVisible => {
        isVisible
            ? modal.style.display = "block"
            : modal.style.display = "none";
    })

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = event => {
        if (event.target === showModalBtn) return // guard
        if (!modal.contains(event.target)) {
            setValueOf(showModalAttr)(false)
        }
    }

    appendFirst(rootElement)(modalElement);
};

const pageCss = `

    .${masterClassName}-modal {
        display: none; /* Hidden by default */
        position: fixed; /* Stay in place */
        z-index: 1; /* Sit on top */
        right: 16px;
        top: 50px;
        width: 355px; /* Full width */
        height: 405px; /* Full height */
        overflow: auto; /* Enable scroll if needed */
        padding: 10px;

        background: #fff;
        border-radius: 8px;
        border: 1px solid #ccc;
        border-color: rgba(0,0,0,.2);

        -webkit-animation: fadeIn .2s;
        animation: fadeIn .2s;

        box-shadow: 0 2px 10px rgba(0,0,0,.2);
    }

    @-webkit-keyframes fadeIn {
    from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
          to { opacity: 1; }
    }


    .${masterClassName}-modal-header {
      padding: 2px 16px;
      background-color: #5cb85c;
      color: white;
    }

    .${masterClassName}-modal-body {padding: 2px 16px;}

    .${masterClassName}-modal-footer {
      padding: 2px 16px;
      background-color: #5cb85c;
      color: white;
    }
`;
