/* NPM */
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const { body, validationResult, check } = require('express-validator')

/* Module */
const { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContact } = require('./utils/contacts')

const app = express()
const port = 2077

//Use EJS
app.set('view engine', 'ejs')

//Third-party Middelware
app.use(expressLayouts)

//Build-In Middelware
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
  const Mahasiswa = [
    {
      nama: "Rhaul Ken",
      email: "rahul@user.com"
    },
    {
      nama: "jajang",
      email: "jajang@user.com"
    },
    {
      nama: "Guest",
      email: "guest@user.com"
    },
  ]

  res.render('index', {
    layout: 'layouts/main-layout',
    title: 'Home',
    mahasiswa: Mahasiswa
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/main-layout',
    title: 'About'
  })
})

app.get('/contact', (req, res) => {
  const contacts = loadContact();

  res.render('contact', {
    layout: 'layouts/main-layout',
    title: 'Contact',
    contacts
  })
})

//Halaman Tambah Kontak
app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    layout: 'layouts/main-layout',
    title: 'Tambah Data Contact'
  })
})

//Proses Tambah Kontak
app.post('/contact',
[
  body('nama').custom((value) => {
    const duplicate = cekDuplikat(value)

    if (duplicate) {
      throw new Error('Nama contact sudah digunakan.')
    }
    return true;
  }),
  check('email', 'Email tidak valid.').isEmail(),
  check('noHP', 'No. HP tidak valid.').isMobilePhone('id-ID')
], 
(req, res) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {

      res.render('add-contact', {
        layout: 'layouts/main-layout',
        title: 'Tambah Data Contact',
        errors: err.array()
      })
    }else{
      addContact(req.body)
      res.send('<script>alert(`Data Berhasil Ditambahkan.`); location.href=`/contact`;</script>')
    }
})

//Proses Hapus Kontak
app.get('/contact/delete/:nama', (req, res) => {
  const contact = findContact(req.params.nama)
  
  if (!contact) {
    res.status(404)
    res.send('<h1>404 | Data Tidak Ditemukan.</h1>')
  }else{
    deleteContact(req.params.nama)
    res.send('<script>alert(`Data Berhasil Dihapus.`); location.href=`/contact`;</script>')
  }
})

//Halaman Ubah Kontak
app.get('/contact/edit/:nama', (req, res) => {
  const contact = findContact(req.params.nama)

  res.render('edit-contact', {
    layout: 'layouts/main-layout',
    title: 'Ubah Data Contact',
    contact
  })
})

//Proses Ubah Kontak
app.post('/contact/update/:nama',
[
  body('nama').custom((value, {req}) => {
    const duplicate = cekDuplikat(value)

    if (value.toLowerCase() !== req.body.old_nama.toLowerCase() && duplicate) {
      throw new Error('Nama contact sudah digunakan.')
    }
    return true;
  }),
  check('email', 'Email tidak valid.').isEmail(),
  check('noHP', 'No. HP tidak valid.').isMobilePhone('id-ID')
], 
(req, res) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
      const contact = findContact(req.params.nama)

      res.render('edit-contact', {
        layout: 'layouts/main-layout',
        title: 'Ubah Data Contact',
        errors: err.array(),
        contact
      })
    }else{
      updateContact(req.body)
      res.send('<script>alert(`Data Berhasil Diubah.`); location.href=`/contact`;</script>')
    }
})

//Halaman Detail Kontak
app.get('/contact/:nama', (req, res) => {
  const contact = findContact(req.params.nama);

  res.render('detail', {
    layout: 'layouts/main-layout',
    title: 'Detail Contact',
    contact
  })
})

app.use('/', (req, res) => {
  res.status(404);
  res.send('<h1>404 | Not Found</h1>')
})

app.listen(port, () => {
  console.log(`Example app listening on port:${port}`)
})