using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{

    public class LikesRepository : ILikesRepository
    {
        public DataContext _context { get; }
        public LikesRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId, likedUserId);
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.Users
                .Include(x => x.LikedUsers)
                .FirstOrDefaultAsync(x => x.Id == userId);
        }
        
        public async Task<PagedList<LikeDto>> GetUserLikes(LikedParams likedParams)
        {
            var predicate = likedParams.Predicate;
            var userId = likedParams.UserId;

            var users = _context.Users.OrderBy(user => user.UserName).AsQueryable();
            var likes = _context.Likes.AsQueryable();

            //the users the currently logged in user has liked
            if (predicate == "liked")
            {
                likes = likes.Where(like => like.SourceUserId == userId);
                users = likes.Select(like => like.LikedUser);
            }

            //the users that like the currently logged in user
            if (predicate == "likedBy")
            {
                likes = likes.Where(like => like.LikedUserId == userId);
                users = likes.Select(like => like.SourceUser);
            }

            var likedUsers = users.Select(x => new LikeDto
            {
                Username = x.UserName,
                KnownAs = x.KnownAs,
                Age = x.DateOfBirth.CalculateAge(),
                PhotoUrl = x.Photos.FirstOrDefault(x => x.IsMain).Url,
                City = x.City,
                Id = x.Id
            });

            return await PagedList<LikeDto>.CreateAsync(likedUsers, likedParams.PageNumber, likedParams.PageSize);
        }


    }
}