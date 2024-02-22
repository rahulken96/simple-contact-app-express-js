const fs = require('fs')

/* Membuat Folder "Data" */
const dirPath = './data'
if(!fs.existsSync(dirPath)){
  fs.mkdirSync(dirPath)
}

/* Membuat file "contact.json" jika belum ada */
const dataPath = './data/contact.json'
if(!fs.existsSync(dataPath)){
  fs.writeFileSync(dataPath, '[]', 'utf-8')
}

/* Ambil Data Kontak */
const loadContact = () => {
  const fileBuff = fs.readFileSync('data/contact.json', 'utf-8')
  const contacts = JSON.parse(fileBuff)
  return contacts
}

/* Ambil Data Kontak Berdasarkan Nama */
const findContact = (nama) => {
  const contacts = loadContact()
  const contact = contacts.find((item) => item.nama.toLowerCase() === nama.toLowerCase())
  return contact
}

/* Menuliskan / menimpa file contact.json dengan data yang baru */
const saveContact = (contact) => {
  fs.writeFileSync('data/contact.json', JSON.stringify(contact))
}

/* Menambahkan data kontak baru ke contact.json */
const addContact = (contact) => {
  const contacts = loadContact()
  contacts.push(contact)

  saveContact(contacts)
}

/* Cek nama duplikat */
const cekDuplikat = (nama) => {
  const contacts = loadContact()
  return contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase())
}

/* Hapus data kontak */
const deleteContact = (nama) => {
  const contacts = loadContact()
  const filterContacts = contacts.filter((contact) => contact.nama.toLowerCase() !== nama.toLowerCase())
  
  saveContact(filterContacts)
}

const updateContact = (contactBaru) => {
  const contacts = loadContact()

  //Hilangkan kontak lama
  const filterContacts = contacts.filter((contact) => contact.nama.toLowerCase() !== contactBaru.old_nama.toLowerCase())
  delete contactBaru.old_nama

  filterContacts.push(contactBaru)
  saveContact(filterContacts)
}

module.exports = { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContact }