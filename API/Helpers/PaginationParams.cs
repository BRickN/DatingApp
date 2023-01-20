using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class PaginationParams
    {
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
        private const int MaxPageSize = 50;
        private int _pageSize { get; set; } = 10;

        public int PageNumber { get; set; } = 1;
    }
}