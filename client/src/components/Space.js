function Space(props) {
  return (
    <div>
      <header>
        <nav>
          <span>logo</span>
          <button>User Account</button>
        </nav>
      </header>
      <main>
        <section>Create Space</section>
        <section>Space List</section>
        <section>
          <span>List Members</span>
          <input type="text" placeholder="Enter Invitee's Username" />
          <button>Invite</button>
        </section>
        <section>Post List</section>
        <section>Chat Box</section>
        <section>Event List</section>
      </main>
    </div>
  );
}

export default Space;
