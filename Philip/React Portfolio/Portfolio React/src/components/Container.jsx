function Component({children, id}) {
  return <section className="glass container" id={id}>
  {children}
  </section>;
}

export default Component;