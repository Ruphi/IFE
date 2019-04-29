import './index.scss';

const div = document.createElement('div');

const xhr = new XMLHttpRequest();
xhr.open('GET', '../static/data/project-list.json', true);
xhr.onreadystatechange = function (){
    if (xhr.readyState === 4 && xhr.status === 200) {
        const res = JSON.parse(xhr.response);

        const h2 = document.createElement('h2');
        h2.innerHTML = res.title;

        const liFragment = document.createDocumentFragment();
        for (let i = 0; i < res.list.length; i++) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.innerHTML = res.list[i]['name'];
            a.href = res.list[i]['url'];

            li.appendChild(a);
            liFragment.appendChild(li);
        }

        div.appendChild(h2);
        div.appendChild(liFragment);
        document.body.appendChild(div);
    }else {

    }
}
xhr.send();