import TopUserCard from '../elementos/TopUserCard'

function TopUsersSection() {
  const users = [
    { id: 1, name: 'Omar Hankhim', image: '/assets/users/user1.jpg', rating: '★★★☆☆' },
    { id: 2, name: 'Andoni Zubizarreta', image: '/assets/users/user2.jpg', rating: '★★★☆☆' },
    { id: 3, name: 'Susana Pérez', image: '/assets/users/user3.jpg', rating: '★★★★☆' },
    { id: 4, name: 'Omar Hankhim', image: '/assets/users/user1.jpg', rating: '★★★☆☆' },
    { id: 5, name: 'Andoni Zubizarreta', image: '/assets/users/user2.jpg', rating: '★★★★☆' },
    { id: 6, name: 'Susana Pérez', image: '/assets/users/user3.jpg', rating: '★★★★☆' }
  ]

  return (
    <section className="w-full py-10">
      <div className="mx-auto w-full">
        <h2 className="mb-8 text-center font-heading text-h2-desktop leading-h2 font-bold text-vecilend-dark-text">
          Los mejores Usuarios
        </h2>

        <div className="flex flex-wrap justify-center gap-3">
          {users.map((user) => (
            <TopUserCard key={user.id} name={user.name} image={user.image} rating={user.rating} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TopUsersSection