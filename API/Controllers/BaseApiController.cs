using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    //localhost:5001/api/[controller]/
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(LogUserActivity))]
    public class BaseApiController : ControllerBase
    {
    }
}
