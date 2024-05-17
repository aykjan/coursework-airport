// Форматируем цену в денежный формат 

const toCurrency = price => {
    return Intl.NumberFormat('ru-RU',{
        currency:'rub',
        style:'currency'
    }).format(price)
}

const toDate = date => {
    return new Intl.DateTimeFormat('ru-RU', {
        day:'2-digit',
        month:'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date (date))
}



document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
})

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent)
})

const cardElement = document.querySelector('#card');

if (cardElement) {
    cardElement.addEventListener('click', e => {
        if(e.target.classList.contains('js-remove')) {
            const id = e.target.dataset.id;
            const csrf = e.target.dataset.csrf
            fetch('/tickets/remove/' + id, {
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            }).then(res => res.json())
              .then(cardData => {
                if (cardData.tickets.length) {
                    const html = cardData.tickets.map(c => {
                        return `
                        <tr>
                        <td>${c.departureCity}</td>
                        <td>${c.count}</td>
                        <td>
                            <button class="btn btn-small js-remove" data-id='${c.id}'>Удалить</button>
                        </td>
                    </tr>
                        `;
                    }).join('');
                    cardElement.querySelector('tbody').innerHTML = html;
                    cardElement.querySelector('.price').textContent = toCurrency (cardData.price);
                } else {
                    cardElement.innerHTML = '<p>Корзина пуста</p>';
                }
              });
        }
    });
}


M.Tabs.init(document.querySelectorAll('.tabs'))