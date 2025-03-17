import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Card, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);


  return (
    <>
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <Card style={{ width: '39rem' }}>
        <Card.Body className="text-center">
          <div className="mb-3">
            {userInfo.profileImage ? (
              <Image src={userInfo.profileImage} roundedCircle style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
            ) : (
              <div 
                className="rounded-circle bg-secondary d-flex justify-content-center align-items-center"
                style={{ width: '150px', height: '150px', margin: '0 auto' }}
              >
                <span className="text-white" style={{ fontSize: '4rem' }}>
                  {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
            )}
          </div>
          <Card.Title as="h2" className="mb-2">{userInfo.name}</Card.Title>
          <Card.Text className="text-muted mb-4">{userInfo.email}</Card.Text>
          <div className="d-flex justify-content-center ">
           <Link to='/editProfile'>
           <Button className="bg-black">Edit</Button>
           </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
    </>
   
  );
};

export default Profile;