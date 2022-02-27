const router = require('express').Router()
const withAuth = require('../../utils/auth')
const {User, Post, Vote} = require('../../models')

router.get('/', (req, res)=> {
    User.findAll({
        attributes: { exclude: ['password'] }
      })
    .then(dbUserData => res.json(dbUserData))
    .catch(err=> {
        console.log(err)
        res.status(500).json(err)
    })
})

router.get('/:id', withAuth, (req, res) => {
   User.findOne({
    attributes: { exclude: ['password'] },
    include: [
        {
          model: Post,
          attributes: ['id', 'title', 'post_url', 'created_at']
        },
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'created_at'],
            include: {
              model: Post,
              attributes: ['title']
            }
          },
        {
          model: Post,
          attributes: ['title'],
          through: Vote,
          as: 'voted_posts'
        }
      ],
    where:{
        id: req.params.id
    }
   }).then(dbUserData=> {
       if(!dbUserData){
           res.status(404).json({message: 'No user found with this id.'})
       return;
        }
        res.json(dbUserData)
   }).catch(err=> {
       console.log(err)
       res.status(500).json(err)
   })
})

router.post('/', withAuth, (req, res)=> {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }).then(dbUserData=> {
        console.log(dbUserData)
        req.session.save(()=> {
            req.session.user_id= dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData)
        })
    })
    .catch(err=> {
        console.log(err)
        res.json(500).json(err)
    })
})

router.post('/login', (req,res)=> {
    console.log('*')
    console.log(req.body);
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData=> {
        if(!dbUserData){
            res.status(400).json({message: 'No user found with that email address.'})
            return
        }
        const validPassword = dbUserData.checkPassword(req.body.password)
        if(!validPassword){
            res.status(400).json({message: 'Incorrect password.'})
            return
        }
        req.session.save(()=>{
            req.session.user_id= dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({user: dbUserData, message: 'You are now logged in!'})
            // res.render('dashboard')
        })
})
})

router.put('/:id', withAuth, (req, res)=> {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    }).then(dbUserData => {
        if (!dbUserData[0]) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
})

router.delete('/:id', withAuth, (req, res)=> {
    User.destroy({
        where: {
            id: req.params.id
        }
    }).then(dbUserData=> {
        if(!dbUserData){
            res.status(404).json({message: 'No user found with this id'})
            return
        }
        res.json(dbUserData)
    }).catch(err=>{
        console.log(err)
        res.status(500).json(err)
    })
})

router.post('/logout', withAuth, (req, res)=> {
    if(req.session.loggedIn){
        req.session.destroy(()=>{
            res.status(204).end()
        })
       
    } else{
        res.status(404).end()
    }
})

module.exports = router